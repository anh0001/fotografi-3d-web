import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Corporate from '../Templates/Corporate';
import { HomePage, NotFound } from '../pageListAsync';

class Landing extends React.Component {
  render() {
    return (
      <Corporate>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      </Corporate>
    );
  }
}

export default Landing;
