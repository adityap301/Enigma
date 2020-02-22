import React, { useState } from 'react';
import { Headline4 } from '@material/react-typography';
import PropTypes from 'prop-types';
import Button from '@material/react-button';
import UpdateRatingsTable from './UpdateRatingsTable';
import AlertBox from '../../common/AlertBox/index';

const UpdateRatings = (props) => {
  const { history, setSnackbarMessage } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mw7 center ma1 pa2">
      <Headline4 className="purple mt4 mb4 ml1"> Update Ratings for Single Round Match #08 </Headline4>
      <UpdateRatingsTable />
      <Button
        className="ma1 mt3"
        style={{ marginLeft: 'auto', marginRight: 0, display: 'block' }}
        raised
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Update
      </Button>
      <AlertBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Update Confirmation"
        content="Are you sure you want to update the ratings?"
        onAccept={() => {
          history.push('/superuser/ratings/');
          setSnackbarMessage('Ratings successfully updated');
        }}
      />
    </div>
  );
};

UpdateRatings.propTypes = {
  history: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
};

export default UpdateRatings;
