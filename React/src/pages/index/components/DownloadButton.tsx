import { useCallback } from 'react';
import styles from './DownloadButton.module.scss'
import { toPng } from 'html-to-image';
import downloadIcon from '/src/assets/icons/download-solid.svg'

function DownloadButton(props) {
  const onButtonClick = useCallback(() => {
    if (props.profileCardRef.current === null) {
      return
    }

    toPng(props.profileCardRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'your-profile.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [props.profileCardRef])
  
  return (
    <button onClick={onButtonClick} className={styles.download_button}>
        <img src={downloadIcon} alt="다운로드" />
    </button>
  )
}

export default DownloadButton;