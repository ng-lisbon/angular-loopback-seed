'use strict';

var loopback = require('loopback');
var path = require('path');

module.exports = function(Account) {

  Account.disableRemoteMethodByName('changePassword');

  //send password reset link when requested
  Account.on('resetPasswordRequest', sendResetPasswordMail);

  Account.afterRemote('create', sendVerificationMail);

  // If this is a password change request then check the old password first
  Account.beforeRemote( 'prototype.patchAttributes', checkOldPassword );

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

    Account.resetPasswordChange = resetPasswordChange;
    Account.remoteMethod(
        'resetPasswordChange',
        {
            description: 'Change the password using a token',
            accepts: [
                { arg: 'password', type: 'string' },
                { arg: 'req', type: 'object', http: { source: 'req' } },
                { arg: 'res', type: 'object', http: { source: 'res' } }
            ],
            http: { verb: 'put', path: '/resetpasswordchange' }
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
        return sendConfirmationEmail(userInstance, Account.app);
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
  function sendConfirmationEmail(userInstance, app) {
      // var render = loopback.template(path.resolve(__dirname,
      //     '../../server/views/email/register-confirm-html.ejs'));
      var renderTxt = loopback.template( path.resolve(__dirname,
          '../../server/views/email/register-confirm-txt.ejs' ) );
      var options = {
          userFirstname: userInstance.firstname,
          verifyUrl: app.get('public_url') + '/auth/confirm-email/' +
            userInstance.id + '/' + userInstance.verificationToken
      };
      // var html = render(options);
      var txt = renderTxt(options);

      return Account.app.models.Email.send({
          to: userInstance.email,
          from: app.get('mail_from'),
          subject: 'Your account at our platform',
          // html: html,
          text: txt
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


  /**
   * Before a password is changed we check the old password of the user. If
   * the old password is correct then we change the password and send a mail
   * to the user that the change was successful.
   *
   * @param {Object} ctx The current request context.
   * @param {Object} instance The user instance with the new password.
   * @callback {Function} cb Callback function called with `err` argument.
   */
  function checkOldPassword(ctx, instance, cb) {
    if (!ctx.isNewInstance && ctx.args.data && 'password' in ctx.args.data) {
      if (!ctx.args.data.oldPassword) {
        var error = new Error();
        error.statusCode = 401;
        cb(error);
      } else {
        Account.checkpassword(ctx.req.accessToken.userId,
            ctx.args.data.oldPassword, function(err, isMatch) {
          if (err) {
            cb(err);
          } else if (!isMatch) {
            cb(new Error('WrongPassword'));
          } else {
            ctx.args.data.oldPassword = null;
            delete ctx.args.data.oldPassword;
            cb();
          }
        });
      }
    } else {
      cb();
    }
  }

  /**
   * Send a link to the user when she requests to reset the password.
   *
   * @param {Object} info The account info with the e-mail address
   */
  function sendResetPasswordMail(info) {
    var url = app.get('public_url') + '/auth/password-reset/confirm/' +
      info.accessToken.id;
    var html = 'Click <a href="' + url + '">here</a> to reset your password';

    Account.app.models.Email.send({
      to: info.email,
      from: app.get('mail_from'),
      subject: 'Password reset',
      html: html
    }, (error) => {
      if (error) {
        console.trace(error);
      }
    });
  }

    /**
     * Set the password of the user to a new password.
     *
     * @param {String} password The new, hashed password of the user.
     * @param {Object} req The request object.
     * @param {Object} res The result object.
     * @callback {Function} cb Callback function called with `err` argument.
     */
    function resetPasswordChange(password, req, res, cb) {
        if (!req.accessToken) {
            console.trace('Error: No access token.');
            return res.sendStatus(404);
        }
        Account.findById(req.accessToken.userId)
        .then((account) => {
          console.log(account);
          return account.updateAttribute('password', password);
        })
        .then(() => {
          cb();
        })
        .catch((error) => {
          console.trace(error);
          cb(error);
        });
    }

};
