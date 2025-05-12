// useFormStatus must be used in a nested component (Submit is nested inside NewOpinion)
import { useFormStatus } from "react-dom";

export default function Submit() {
    // useFormStatus returns a couple of properties. In our case we can use pending.    
    const { pending } = useFormStatus();

    return (
        <p className="actions">
            <button type="submit" disabled={pending}>
                {pending ? 'Submiting...' : 'Submit'}
            </button>
        </p>
    );
}