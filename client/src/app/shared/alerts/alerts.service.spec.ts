import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let alertsService: AlertsService;

  beforeEach(() => {
    alertsService = new AlertsService();
  });

  it('should return an empty list initially', () => {
    expect(alertsService.getAlerts()).toEqual([]);
  });

  it('should return the alert after adding one', () => {
    const testAlert = {
      type: 'danger',
      message: 'Test message'
    };
    alertsService.addAlert(testAlert);
    expect(alertsService.getAlerts()).toEqual([testAlert]);
  });
});
