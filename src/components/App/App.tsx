import * as React from 'react';
import { connect } from 'react-redux';

import * as types from '../../helpers/types';
import filterAvailableFlights from '../../helpers/flights';
import { fetchDestinations, fetchFlights } from '../../modules/actions';

import DestinationSelection from '../DestinationSelection/DestinationSelection';
import DateSelection from '../DateSelection/DateSelection';
import AvailableFlights from '../AvailableFlights/AvailableFlights';

import './style.less';

interface IApp {
  destinations: types.IDestination[],
  flights: types.IFlights,
  selected: types.ISelectedDestination,
  fetchDestinations: () => () => void,
  fetchFlights: (dep: string, arr: string, monthSel: string) => () => void,
}

class App extends React.Component<IApp, {}> {
  componentDidMount(): void {
    this.props.fetchDestinations();
    console.log(filterAvailableFlights(this.props.flights));
  }

  componentDidUpdate(prevProps: IApp): void {
    const {
      selected: { date, from, to },
      fetchFlights,
    } = this.props;

    if (date !== prevProps.selected.date && from.data && to.data) {
      fetchFlights(from.data.AirportCode, to.data.AirportCode, date);
    }
  }

  render() {
    const { destinations, flights } = this.props;
    return (
      <div className="app">
        {!!destinations.length && (
          <DestinationSelection />
        )}
        <DateSelection />

        {flights && <AvailableFlights days={filterAvailableFlights(flights)} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  destinations: state.destinations,
  flights: state.flights,
  selected: state.selected,
});

const mapDispatchToProps = dispatch => ({
  fetchDestinations: () => dispatch(fetchDestinations()),
  fetchFlights: (dep, arr, monthSel) => dispatch(fetchFlights(dep, arr, monthSel)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);