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

  static formatDDMMYYYY(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString(); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }

  static getWarrantyDurationInDays(warrantyDuration: string): number {
    let result = 0;
    warrantyDuration = warrantyDuration.toLowerCase();
    const warrantyDurationInYear = warrantyDuration.split('y')[0].trim();
    const hasYear = warrantyDuration.includes('y');
    if (warrantyDurationInYear && hasYear) {
      const warrantyDurationInDays = parseInt(warrantyDurationInYear) * 365;
      result += warrantyDurationInDays;
    }
    const warrantyDurationInMonth = warrantyDuration.split('m')[0].trim();
    const hasMonth = warrantyDuration.includes('m');
    if (warrantyDurationInMonth && hasMonth) {
      const warrantyDurationInDays = parseInt(warrantyDurationInMonth) * 30;
      result += warrantyDurationInDays;
    }
    const warrantyDurationInDays = warrantyDuration.split('d')[0].trim();
    const hasDays = warrantyDuration.includes('d');
    if (warrantyDurationInDays && hasDays) {
      result += parseInt(warrantyDurationInDays);
    }
    return result;
  }

  static isItemExpired(purchaseDate: Date, warrantyDurationInDays: number): boolean {
    const expirationDate = DateService.addDays(purchaseDate, warrantyDurationInDays);
    const currentDate = new Date();
    return DateService.IsDateAfter(currentDate, expirationDate);
  }
}

