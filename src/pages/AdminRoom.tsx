import { Button } from "../components/Button";
import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss';
import { RoomCode } from "../components/RoomCode";
import { useHistory, useParams } from "react-router-dom";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory();
  const { id } = useParams<RoomParams>();
  const { title, questions } = useRoom(id);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${id}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${id}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${id}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${id}`).update({
      endedAt: new Date(),
    })
    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={id} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>

        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map(question => <Question
            key={question.id}
            content={question.content}
            author={question.author}
            isHighlighted={question.isHighlighted && !question.isAnswered}
            isAnswered={question.isAnswered}>
            {!question.isAnswered && (
              <>
                <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                  <img src={checkImg} alt="Marcar como respondida" />
                </button>
                <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                  <img src={answerImg} alt="Dar destaque a pergunta" />
                </button>
              </>
            )}
            <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
              <img src={deleteImg} alt="Deletar pergunta" />
            </button>
          </Question>)}
        </div>
      </main>
    </div>
  )
}