import { api } from 'src/boot/axios';
import { Preference } from 'components/models';
import { PreferenceData } from 'src/contracts';

class PreferenceService {
  async savePreference(data: PreferenceData): Promise<Preference> {
    const response = await api.post<Preference>('data/preference', data);
    return response.data;
  }
}

export default new PreferenceService();
