import { registerDecorator, ValidationOptions } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const validCountries = ['HK'];

// export const IsAllowedPhone = Transform(
//   (value: any) => {
//     if (typeof value !== 'string') return undefined;

//     const parsed = parsePhoneNumberFromString(value);
//     if (!parsed) return undefined;
//     if (!validCountries.includes(parsed.country)) return undefined;

//     return parsed.number;
//   },
//   { toClassOnly: true },
// );

export function IsAllowedPhone(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsAllowedPhone',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        defaultMessage: () => 'must be a valid phone',
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const parsed = parsePhoneNumberFromString(value);
          if (!parsed) return false;
          if (!validCountries.includes(parsed.country)) return false;

          return true;
        },
      },
    });
  };
}
