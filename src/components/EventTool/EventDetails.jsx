import EventForm from "./EventFormFields";
import Form from "react-bootstrap/Form";

export default function EventDetails({ event }) {
    return (
        <div className="container pt-3 pb-3">
            <Form id="react-bootstrap-forms-event">
                <EventForm.Static.Name name={event.name} />
                <EventForm.Static.Date date={event.date} />
                <EventForm.Static.Format format={event.format} />
                <EventForm.Static.Host host={event.host} />
                <EventForm.Static.Location location={event.location} />
                <EventForm.Static.Notes notes={event.notes} />
            </Form>
        </div>
    );
}