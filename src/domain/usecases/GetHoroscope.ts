import { Horoscope, HoroscopePeriod } from '../entities/Horoscope';
import { IHoroscopeRepository } from '../repositories/IHoroscopeRepository';

export class GetHoroscope {
  constructor(private repo: IHoroscopeRepository) {}

  async execute(sign: string, period: HoroscopePeriod, date?: string): Promise<Horoscope | null> {
    return this.repo.getBySignAndPeriod(sign, period, date);
  }
}
