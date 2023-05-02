import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import PlayerForm from "./PlayerFormFields";

export default function StaticPlayerForm({ player, formState, onEdit }) {
    return (
        <Form id="react-bootstrap-forms-player" className="pt-3 pb-3">
            <PlayerForm.Static.Names name={player.name} />
            <hr />
            <PlayerForm.Static.Gender gender={player.gender} />
            <PlayerForm.Static.Handedness handedness={player.handedness} />
            <PlayerForm.Static.Roles roles={player.roles} />
            <hr />
            <PlayerForm.Static.Contact contact={player.contact} />
            <hr />
            {player.affiliation.length > 0 && <>
                <PlayerForm.Static.Affiliation affiliation={player.affiliation} />
                <hr />
            </>}
            <PlayerForm.Static.Skills skills={player.skills} skillsChecked={formState.skillsChecked} onSkillsChecked={formState.setSkillsChecked} />
            <hr />
            <PlayerForm.Static.Notes notes={player.notes} />
            <hr />
            <div className="d-grid gap-2">
                <Button variant="warning" size="lg" onClick={onEdit}>Edit</Button>
            </div>
        </Form>
    );
}