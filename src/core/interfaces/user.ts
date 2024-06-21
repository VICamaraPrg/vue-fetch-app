import type { Gender } from '../types/gender';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  email: string;
  image: string;
  phone: string;
}
