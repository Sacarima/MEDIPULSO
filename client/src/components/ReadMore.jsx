

const ReadMore = ({ text, maxLength = 100}) => {

    cosnt [isExpanded, setIsExpanded] = useState(false)
    
    //toggle between read more and read less
    const toggleReadMore = () => {
        setIsExpanded(!isExpanded)
    }

    if(text.length <= maxLength) {
        return <p>{text}</p>
    }

    // decide whether to show the short text or the full text
    const truncatedText = isExpanded ? text : `${text.slice(0, maxLength)}...`

  return (
    <div>
        <p>{truncatedText}</p>
      <button
        onClick={toggleReadMore}
        className="text-blue-500 font-bold"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  )
}

export default ReadMore