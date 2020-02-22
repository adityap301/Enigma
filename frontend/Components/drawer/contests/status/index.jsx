import React from 'react';
import PropTypes from 'prop-types';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import FilterSelectors from './FilterSelectors';
import ProblemStatusTable from './ProblemStatusTable';
import ContestDetails from '../common/ContestDetails';
import Announcements from '../common/Announcements';
import 'tachyons';

const ContestPage = (props) => {
  const { location } = props;
  const { pathname } = location;
  const { match } = props;
  const { params } = match;
  const { id: contestId } = params;
  return (
    <Grid className="mw9 center">
      <Row>
        <Cell desktopColumns={9} tabletColumns={8}>
          <FilterSelectors />
        </Cell>
        <Cell desktopColumns={9} tabletColumns={8}>
          <ProblemStatusTable pathname={pathname} contestId={contestId} />
        </Cell>
        <Cell desktopColumns={3} tabletColumns={8}>
          <Cell>
            <ContestDetails />
          </Cell>
          <Cell>
            <Announcements />
          </Cell>
        </Cell>
      </Row>
    </Grid>
  );
};

ContestPage.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};


export default ContestPage;
