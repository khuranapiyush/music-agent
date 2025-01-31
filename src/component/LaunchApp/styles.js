const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '380px',
    margin: 'auto',
    // aspectRatio: '1200 / 526',
    marginBottom: '120px',

    '@media (max-width: 767px)': {
      aspectRatio: '0',
      height: '100%',
      width: '100%',
      marginBottom: '20px',
      marginTop: '10px',
    },
  },
  imageStyle: {
    '& img': {
      maxWidth: 'none',
      '@media (max-width: 767px)': {
        maxWidth: '187px',
        float: 'right',
      },
    },
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '12px',
    height: '100%',
    width: '100%',
    display: 'flex',
    '@media (max-width: 767px)': {
      display: 'block',
      height: '100%',
      marginTop: '10px',
    },
  },
  marginLeft24: {
    marginLeft: '24px',
    '@media (max-width: 767px)': {
      marginLeft: '0px',
    },
  },
  noteTextStyles: {
    paddingTop: '24px',
    paddingBottom: '24px',
    '@media(max-width:767px)': {
      paddingTop: '16px',
    },
  },

  content: {
    margin: 'auto',
    '& h1': {
      color: '#FFF',
      fontFamily: 'Bricolage Grotesque',
      fontSize: '64px',
      fontWeight: '600',
      fontStyle: 'normal',
      lineHeight: '51.2px',
      textTransform: 'uppercase',
    },

    '& h5': {
      color: '#FFF',
      fontFamily: 'Nohemi',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '500',
      paddingTop: '16px',
      textTransform: 'none',
    },
  },
};

export default styles;
