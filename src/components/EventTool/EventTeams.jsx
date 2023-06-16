export default function EventTeams({teams}) {
    return (
        <div>
            
            {Object.keys(teams).map(team => (
                <p>{team}: {teams[team].join(', ')}</p>
            ))}
        </div>
    );
}