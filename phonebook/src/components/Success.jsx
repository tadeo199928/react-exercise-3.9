const Notification = ({ success }) => {
  if (!success) {
    return null
  }

  return (
    <div className='success'>
      {success}
    </div>
  )
}

export default Notification
