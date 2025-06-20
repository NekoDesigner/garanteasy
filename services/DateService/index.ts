export class DateService {
  static IsDateAfter(date: Date, referenceDate: Date): boolean {
    const dateToCheck = new Date(date);
    const refDate = new Date(referenceDate);
    return dateToCheck.getTime() > refDate.getTime();
  }
  static getDaysBetweenDates(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  static formatDate(date: Date, locale: string = 'fr-FR'): string {
    return date.toLocaleDateString(locale);
  }

  static formatDDMM(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    return `${day}/${month}`;
  }

  static formatMMYY(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${month}/${year}`;
  }
}

