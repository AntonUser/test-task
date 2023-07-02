import { Matches } from 'class-validator';

export const Password = () =>
  Matches('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}', undefined, {
    message:
      'password: Password must be 8 characters long, 1 lowercase and 1 uppercase character',
  });
// export function Password(value: string) {
//   if (
//     matches(
//       value,
//       new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}'),
//     )
//   ) {
//     throw new BadRequestException(
//       'Password must be 8 characters long, 1 lowercase and 1 uppercase character',
//     );
//   }
//   return Matches(
//   ,
//     undefined,
//     {
//       message:
//         'password: Password must be 8 characters long, 1 lowercase and 1 uppercase character',
//     },
//   );
// }
