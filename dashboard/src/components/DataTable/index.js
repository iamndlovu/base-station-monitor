import tableStyles from './DataTable.module.scss';

const DataTable = ({ data, toggle }) => {
  return (
    <section className={tableStyles.container}>
      <button onClick={() => toggle()} className={tableStyles.closeBtn}>
        X
      </button>
      <h1>historical data</h1>
      <table className={tableStyles.DataTable}>
        <thead className={tableStyles.tableHead}>
          <tr>
            <td>Date</td>
            <td>Temperature</td>
            <td>Transmitted Signal</td>
            <td>Generator</td>
            <td>UPS</td>
          </tr>
        </thead>
        <tbody className={tableStyles.tableBody}>
          {data &&
            data.map((item) => {
              const { temperature, battery, fuel, signal, createdAt, _id } =
                item;
              const { tempVal, fan } = temperature;
              const { generator, level } = fuel;
              const { strength } = signal;
              const { ups } = battery;
              const tempHH = temperature.hh;
              const tempH = temperature.h;
              const tempLL = temperature.ll;
              const tempL = temperature.l;
              const fuelLL = fuel.ll;
              const fuelL = fuel.l;
              const fuelHH = fuel.hh;
              const fuelH = fuel.h;
              const signalHH = signal.hh;
              const signalH = signal.h;
              const signalLL = signal.ll;
              const signalL = signal.l;
              const batteryH = battery.h;
              const batteryHH = battery.hh;
              const batteryLL = battery.ll;
              const batteryL = battery.l;
              const batteryLevel = battery.level;

              return (
                <tr key={_id}>
                  <td>{new Date(createdAt).toLocaleString()}</td>
                  {/* Temperature */}
                  <td>
                    <ul>
                      <li>
                        <span>Value:</span>
                        <span>{tempVal}</span>
                      </li>
                      <li>
                        <span>Value Status:</span>
                        <span>
                          {tempVal <= tempLL
                            ? 'Very Low'
                            : tempVal <= tempL
                            ? 'Low'
                            : tempVal < tempH
                            ? 'Moderate'
                            : tempVal < tempHH
                            ? 'High'
                            : 'Very High'}
                        </span>
                      </li>
                      <li>
                        <span>Fan:</span>
                        <span>{fan ? 'ON' : 'OFF'}</span>
                      </li>
                    </ul>
                  </td>
                  {/* Transmitted Signal */}
                  <td>
                    <ul>
                      <li>
                        <span>Strength:</span>
                        <span>{strength}</span>
                      </li>
                      <li>
                        <span>Strength Status:</span>
                        <span>
                          {strength <= signalLL
                            ? 'Very Weak'
                            : strength <= signalL
                            ? 'Weak'
                            : strength < signalH
                            ? 'Moderate'
                            : strength < signalHH
                            ? 'Good'
                            : 'Excellent'}
                        </span>
                      </li>
                    </ul>
                  </td>
                  {/* Generator */}
                  <td>
                    <ul>
                      <li>
                        <span>Fuel:</span>
                        <span>{level}</span>
                      </li>
                      <li>
                        <span>Fuel Status:</span>
                        <span>
                          {level <= fuelLL
                            ? 'Very Low'
                            : level <= fuelL
                            ? 'Low'
                            : level < fuelH
                            ? 'Moderate'
                            : level < fuelHH
                            ? 'High'
                            : 'Excellent'}
                        </span>
                      </li>
                      <li>
                        <span>Generator Status:</span>
                        <span>{generator ? 'ON' : 'OFF'}</span>
                      </li>
                    </ul>
                  </td>
                  {/* UPS */}
                  <td>
                    <ul>
                      <li>
                        <span>Battery:</span>
                        <span>{batteryLevel}</span>
                      </li>
                      <li>
                        <span>Battery Status:</span>
                        <span>
                          {batteryLevel <= batteryLL
                            ? 'Very Low'
                            : batteryLevel <= batteryL
                            ? 'Low'
                            : batteryLevel < batteryH
                            ? 'Moderate'
                            : batteryLevel < batteryHH
                            ? 'Good'
                            : 'Excellent'}
                        </span>
                      </li>
                      <li>
                        <span>UPS:</span>
                        <span>{ups ? 'ON' : 'OFF'}</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
};

export default DataTable;
