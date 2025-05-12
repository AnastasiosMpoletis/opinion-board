import { use, useActionState, useOptimistic } from "react";
import { OpinionsContext } from '../store/opinions-context.jsx';

export function Opinion({ opinion: { id, title, body, userName, votes } }) {
  const { upvoteOpinion, downvoteOpinion } = use(OpinionsContext);

  /**
   * Should be called inside form actions. useOptimistic can detect in which form action they are in.
   * PreviousVotes is passed automatically by React. Any other parameters are passed by us.
   * It gives us a temporary value that is shown as long as the the form is being submitted.
   * 
   * It updates the value instantly, before the request is completed.
   * If an error occurs during request, value is reverted to previous value.
   */
  const [optimisticVotes, setVotesOptimistically] = useOptimistic(votes, (previousVotes, mode) => (mode === 'up' ? previousVotes + 1 : previousVotes - 1));

  async function upvoteAction() {
    setVotesOptimistically('up'); //should be called before request
    await upvoteOpinion(id);
  }

  async function downvoteAction() {
    setVotesOptimistically('down'); //should be called before request
    await downvoteOpinion(id);
  }

  const [upvoteFormState, upvoteFormAction, upvotePending] = useActionState(upvoteAction);
  const [downvoteFormState, downvoteFormAction, downvotePending] = useActionState(downvoteAction);

  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        {/* 
          We can use formAction to set an action to a button that exists inside the form. 
          Button action can be different from form action. 
        */}
        <button
          formAction={upvoteFormAction}
          disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        <span>{optimisticVotes}</span>

        <button
          formAction={downvoteFormAction}
          disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}
