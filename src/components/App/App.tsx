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
  destinations: types.IDestination[];
  flights: types.IFlights;
  flightsLoading: types.FlightsLoading;
  selected: types.ISelectedDestination;
  fetchDestinations: () => () => void;
  fetchFlights: (dep: string, arr: string, monthSel: string) => () => void;
}

class App extends React.Component<IApp, {}> {
  componentDidMount(): void {
    this.props.fetchDestinations();
  }

  render() {
    const {
      destinations,
      flights,
      flightsLoading,
      selected: { from, to },
    } = this.props;

    if (!destinations.length) {
      return <div className="app" />;
    }

    return (
      <div className="app">
        {destinations.length && <DestinationSelection />}
        {from.data && to.data && (
          <>
            <DateSelection />
            <AvailableFlights
              days={filterAvailableFlights(flights)}
              flightsLoading={flightsLoading}
            />
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  destinations: state.destinations,
  flights: state.flights,
  selected: state.selected,
  flightsLoading: state.flightsLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchDestinations: () => dispatch(fetchDestinations()),
  fetchFlights: (dep, arr, monthSel) => dispatch(fetchFlights(dep, arr, monthSel)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
