const Notification = ({ error }) => {
  if (!error) {
    return null
  }

  return (
    <div className='error'>
      {error}
    </div>
  )
}

export default Notification