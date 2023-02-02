import { Link } from 'react-router-dom';

function DiaryTotalItem({ diaryIdx, creationDate, content }) {
  const strDate = new Date(creationDate).toLocaleString();

  return (
    <Link to={`/Diary/${diaryIdx}`} state={{ diaryIdx: diaryIdx }}>
      <div>
        <div>일기 번호: {diaryIdx}</div>
        <span>그림 들어갈 자리</span>
        <div>작성 시간: {strDate}</div>
        <div>{content}</div>
      </div>
    </Link>
  );
}

export default DiaryTotalItem;