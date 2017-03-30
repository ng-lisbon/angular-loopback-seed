'use strict';

var loopback = require('loopback');
var path = require('path');
var config = require('../../server/config.json');

module.exports = function(Account) {

  Account.afterRemote('create', sendVerificationMail);

  Account.verifyconfirm = verifyconfirm;
  Account.remoteMethod(
      'verifyconfirm',
      {
          description: 'Confirm a user registration with email verification token. Verify if already confirmed.',
          accepts: [
              { arg: 'uid', type: 'string', required: true },
              { arg: 'token', type: 'string', required: true }
          ],
          http: { verb: 'get', path: '/verifyconfirm' }
      }
  );

  Account.checkpassword = checkpassword;
  Account.remoteMethod(
      'checkpassword',
      {
          description: 'Confirm a user registration with email verification token. Verify if already confirmed.',
          accepts: [
              { arg: 'id', type: 'string', http: { source: 'path' } },
              { arg: 'password', type: 'string', required: true }
          ],
          http: { verb: 'get', path: '/:id/checkpassword' },
          returns: { arg: 'hasPassword', type: 'boolean' }
      }
  );


//  ###                                                                                            
//   #  #    # #####  #      ###### #    # ###### #    # #####   ##   ##### #  ####  #    #  ####  
//   #  ##  ## #    # #      #      ##  ## #      ##   #   #    #  #    #   # #    # ##   # #      
//   #  # ## # #    # #      #####  # ## # #####  # #  #   #   #    #   #   # #    # # #  #  ####  
//   #  #    # #####  #      #      #    # #      #  # #   #   ######   #   # #    # #  # #      # 
//   #  #    # #      #      #      #    # #      #   ##   #   #    #   #   # #    # #   ## #    # 
//  ### #    # #      ###### ###### #    # ###### #    #   #   #    #   #   #  ####  #    #  ####                                                                                               
  /**
   * 
   * 
   * @param {Object} context The request context. 
   * @param {Object} userInstance The user instance.
   * @callback {Function} cb Callback function called with `err` argument.
   */  
  function sendVerificationMail(context, userInstance, cb) {
    var User = Account.app.models.User;
    User.generateVerificationToken(userInstance, (error, token) => {
      if (error) {
        cb(error);
        return;
      }
      userInstance.verificationToken = token;
      userInstance.save()
      .then(() => {
        return sendConfirmationEmail(userInstance);
      })
      .then(() => {
        cb();
      })
      .catch((error) => {
        console.trace(error);
        return cb(error);
      });
    });
  }

  /**
   * Send a confirmation mail to the user in the given user instance.
   *
   * @param {Object} userInstance The user instance.
   * @callback {Function} cb Callback function called with `err` argument.
   */
  function sendConfirmationEmail(userInstance) {
      // var render = loopback.template(path.resolve(__dirname,
      //     '../../server/views/email/register-confirm-html.ejs'));
      var renderTxt = loopback.template( path.resolve(__dirname,
          '../../server/views/email/register-confirm-txt.ejs' ) );
      var options = {
          userFirstname: userInstance.firstname,
          verifyUrl: config.public_url + '/auth/confirm-email/' +
            userInstance.id + '/' + userInstance.verificationToken
      };
      // var html = render(options);
      var txt = renderTxt(options);

      return Account.app.models.Email.send({
          to: userInstance.email,
          from: config.email_from,
          subject: 'Your account at our platform',
          // html: html,
          text: txt
      });
  }

  /**
   * Set the user to confirmed. This happens after the user clicked on the
   * confirmation link in the mail that we send him after registration.
   *
   * @param {String} id The user ID.
   * @param {String} token The confirmation token from the confirmation mail.
   * @callback {Function} cb Callback function called with `err` argument.
   */
  function verifyconfirm(id, token, cb) {
    Account.findById(id)
    .then((u) => {
      if (!u) {
        var err = new Error('User not found: ' + id);
        err.statusCode = 404;
        err.code = 'USER_NOT_FOUND';
        cb(err);
      } else {
        if (u.emailVerified) {
          var err = new Error('User already confirmed');
          err.statusCode = 404;
          err.code = 'USER_CONFIRMED';
          cb(err);
        } else {
          // var User = user.app.models.User;
          Account.confirm(id, token, null, function() {
            cb(null);
          });
        }
      }
    })
    .catch((error) => {
      console.trace(error);
      cb(error);
    });
  }

  /**
   * Check if the given password is the user's password.
   *
   * @param {String} id The user ID.
   * @param {String} password Password to check, if it's the user's password.
   * @callback {Function} cb Callback function called with `err` argument.
   */
  function checkpassword(id, password, cb) {
    Account.findById(id)
    .then((account) => {
      account.hasPassword(password, function(err, isMatch) {
        cb(null, isMatch);
      });
    })
    .catch((error) => {
      cb(error);
    })
  }

};
