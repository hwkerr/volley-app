import EventForm from "./EventFormFields";
import Form from "react-bootstrap/Form";

export default function EventDetails({ event, onCancel }) {
    const [editMode, setEditMode] = useState(false);

    // TODO: instead of EventForm.Static/Editable,
    // can we just use <fieldset disabled /> or an "editable" atrribute to turn off edit mode?
    const getStatic_deprecate = () => (
        <div className="container pt-3 pb-3">
            <fieldset disabled>
                <Form id="react-bootstrap-forms-event">
                    <EventForm.Static.Name name={event.name} />
                    <EventForm.Static.Date date={event.date} />
                    <EventForm.Static.Format format={event.format} />
                    <EventForm.Static.Host host={event.host} />
                    <EventForm.Static.Location location={event.location} />
                    <EventForm.Static.Notes notes={event.notes} />
                    <div className="d-grid gap-2">
                        <div className="btn-group">
                            <Button variant="secondary" size="lg" type="button" onClick={onCancel}>Cancel</Button>
                        </div>
                    </div>
                </Form>
            </fieldset>
        </div>
    );
    
    return (
        editMode ? getStatic_deprecate() :
        <div className="container pt-3 pb-3">
            <fieldset disabled>
                <Form id="react-bootstrap-forms-event">
                    <EventForm.Static.Name name={event.name} />
                    <EventForm.Static.Date date={event.date} />
                    <EventForm.Static.Format format={event.format} />
                    <EventForm.Static.Host host={event.host} />
                    <EventForm.Static.Location location={event.location} />
                    <EventForm.Static.Notes notes={event.notes} />
                    <div className="d-grid gap-2">
                        <div className="btn-group">
                            <Button variant="secondary" size="lg" type="button" onClick={onCancel}>Cancel</Button>
                        </div>
                    </div>
                </Form>
            </fieldset>
        </div>
    );
}