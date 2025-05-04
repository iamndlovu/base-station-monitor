class Alarm {
  constructor(equipment, parameter, message, alarmClass) {
    this.equipment = equipment || '';
    this.parameter = parameter || '';
    this.alarmClass = alarmClass || 'success';
    this.message = message || '';
  }

  /**
   * @returns {String}
   */
  get equip() {
    return this.equipment;
  }

  set equip(equipment = '') {
    this.equipment = equipment;
  }

  /**
   * @returns {String}
   */
  get param() {
    return this.parameter;
  }

  set param(parameter = '') {
    this.parameter = parameter;
  }

  /**
   * @returns {String}
   */
  get msg() {
    return this.message;
  }

  set msg(message = '') {
    this.message = message;
  }

  /**
   * @returns {String}
   */
  get almClass() {
    return this.alarmClass;
  }

  set almClass(alarmClass = '') {
    this.alarmClass = alarmClass;
  }
}
export default Alarm;
