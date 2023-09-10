import { AES, PBKDF2, enc, lib } from 'crypto-js';
import path from 'path';
import fs from 'fs';
import { Logger } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { CredentialComponent } from '../../modules/credential/entities/credential.component.entity';
const REDACTED_CREDENTIAL_VALUE = '_APP_CENTER_REDACTED_CREDENTIAL_VALUE__';
export const maskingString = (str: string, start: number, end: number) => {
  if (
    !str ||
    start < 0 ||
    start >= str.length ||
    end < 0 ||
    end > str.length ||
    start >= end
  ) {
    return str;
  }
  const maskLength = end - start;
  const maskedStr =
    str.substring(0, start) + '*'.repeat(maskLength) + str.substring(end);
  return maskedStr;
};

/**
 * Returns the path of encryption key
 * @returns {string}
 */
export const getEncryptionKeyPath = (): string => {
  return process.env.SECRETKEY_PATH
    ? path.join(process.env.SECRETKEY_PATH, 'encryption.key')
    : path.join(__dirname, 'assets', 'encryption.key');
};

/**
 * Generate an encryption key
 * @returns {string}
 */
export const generateEncryptKey = (): string => {
  if (process.env.KEY) {
    console.log('[Use custom encryption key]');
    return process.env.KEY;
  } else {
    console.log('[Use Generate encryption key]');
    const salt = lib.WordArray.random(128 / 8);
    const key256Bits = PBKDF2(process.env.PASSPHRASE || 'PASSPHRASE', salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });
    return key256Bits.toString();
  }
};

/**
 * Returns the encryption key
 * @returns {Promise<string>}
 */
export const getEncryptionKey = async (): Promise<string> => {
  try {
    return await fs.promises.readFile(getEncryptionKeyPath(), 'utf8');
  } catch (error) {
    console.log('Encryption key not found. Now generateEncryptKey()');
    const encryptKey = generateEncryptKey();
    await fs.promises.writeFile(getEncryptionKeyPath(), encryptKey);
    return encryptKey;
  }
};

/**
 * Encrypt credential data
 * @param {ICredentialDataDecrypted} plainDataObj
 * @returns {Promise<string>}
 */
export const encryptCredentialData = async (
  plainDataObj: string
): Promise<string> => {
  const encryptKey = await getEncryptionKey();
  return AES.encrypt(plainDataObj, encryptKey).toString();
};

/**
 * Decrypt credential data
 * @param {string} encryptedData
 * @param {string} componentCredentialName
 * @param {any} componentCredentials
 * @returns {Promise<any>}
 */
export const decryptCredentialData = async (
  encryptedData: string,
  componentCredentialName?: string,
  componentCredentials?: {
    [ket: string]: CredentialComponent;
  }
): Promise<string> => {
  const encryptKey = await getEncryptionKey();
  const decryptedData = AES.decrypt(encryptedData, encryptKey);
  try {
    if (componentCredentialName && componentCredentials) {
      const plainDataObj: Record<string, string> = JSON.parse(
        decryptedData.toString(enc.Utf8)
      );
      return redactCredentialWithPasswordType(
        componentCredentialName,
        plainDataObj,
        componentCredentials
      );
    }
    return decryptedData.toString(enc.Utf8);
  } catch (e) {
    console.error(e);
    throw new Error('Credentials could not be decrypted.');
  }
};

/**
 * Redact values that are of password type to avoid sending back to client
 * @param {string} componentCredentialName
 * @param {Record<string,string> } decryptedCredentialObj
 * @param {{[ket: string]: CredentialComponent;}} componentCredentials
 * @returns {ICredentialDataDecrypted}
 */
export const redactCredentialWithPasswordType = (
  componentCredentialName: string,
  decryptedCredentialObj: Record<string, string>,
  componentCredentials: {
    [ket: string]: CredentialComponent;
  }
): string => {
  const plainDataObj = cloneDeep(decryptedCredentialObj);
  for (const cred in plainDataObj) {
    const inputParam = componentCredentials[
      componentCredentialName
    ].inputs?.find((inp) => inp.type === 'password' && inp.name === cred);
    if (inputParam) {
      plainDataObj[cred] = REDACTED_CREDENTIAL_VALUE;
    }
  }
  return JSON.stringify(plainDataObj);
};
