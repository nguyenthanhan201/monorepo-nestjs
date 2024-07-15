import { createClient } from "@supabase/supabase-js";

// @Injectable()
// export class SupabaseService {
//   // private readonly storage: admin.storage.Storage;

//   constructor() {
//     // admin.initializeApp({
//     //   credential: admin.credential.cert(firebaseCredential),
//     //   storageBucket: firebaseStorageBucket,
//     // });

//     return createClient(
//       "https://qyruvrpvtuvshysvrtcx.supabase.co",
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cnV2cnB2dHV2c2h5c3ZydGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NzQ4NzQsImV4cCI6MjAyNjA1MDg3NH0.SuKyz0nfNmLg1PHIjinhNBohhaAxMbjV0GlOSrN2mPY"
//     );
//     // this.storage = admin.storage();
//   }
// }

const supabaseService = createClient(
  "https://qyruvrpvtuvshysvrtcx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cnV2cnB2dHV2c2h5c3ZydGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NzQ4NzQsImV4cCI6MjAyNjA1MDg3NH0.SuKyz0nfNmLg1PHIjinhNBohhaAxMbjV0GlOSrN2mPY"
);

export { supabaseService };
