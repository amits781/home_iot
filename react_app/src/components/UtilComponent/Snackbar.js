import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import './util.css';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function TransitionsSnackbar({isOpen}) {
  const [state, setState] = React.useState({
    open: isOpen,
    Transition: SlideTransition,
  });

//   const handleClick = (Transition) => () => {
//     setState({
//       open: true,
//       Transition,
//     });
//   };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <div>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message="I love snacks"
        key={state.Transition.name}
        className='snackbar-display'
      />
    </div>
  );
}
