import { api } from 'src/boot/axios';
import { User } from 'components/models';
import { PreferenceData } from 'src/contracts';

class PreferenceService {
  async savePreference(data: PreferenceData): Promise<User> {
    const response = await api.post<User>('data/preference', data);
    return response.data;
  }
}

export default new PreferenceService();
