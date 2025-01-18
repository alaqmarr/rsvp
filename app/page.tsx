import Image from "next/image";

export default function Home() {
  return (
    <section>
      <h1>Total RSVPS Done.</h1>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>RSVPs</th>
          </tr>
        </thead>
      </table>
    </section>
  );
}
