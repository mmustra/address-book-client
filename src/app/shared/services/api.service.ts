import { environment } from 'src/environments/environment';

export abstract class ApiService {
  constructor(protected apiUrl: string = environment.apiUrl) {}
}
