import { OAuth2Client } from 'google-auth-library';

export interface GoogleSignInPayload {
    iss: string,
    azp: string,
    aud: string
    sub: string
    email: string
    email_verified: boolean,
    nbf: number,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale: string,
    iat: number,
    exp: number,
    jti: string
    // Otras propiedades según la necesidad
  }

const client = new OAuth2Client();
async function googleVerify( token:string = '') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload:GoogleSignInPayload | any = ticket.getPayload();

  const { name, picture, email } = payload;
  

  return {
    name,
    picture,
    email
  }

}


export {
    googleVerify
}