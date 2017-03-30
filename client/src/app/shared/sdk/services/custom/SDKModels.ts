/* tslint:disable */
import { Injectable } from '@angular/core';
import { Email } from '../../models/Email';
import { Account } from '../../models/Account';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    Email: Email,
    Account: Account,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
