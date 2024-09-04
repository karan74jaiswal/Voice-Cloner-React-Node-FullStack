import { Main } from "./Main";
import { VoiceProvider } from "./VoiceProvider";

export default function VideoSubtitle() {
  return (
    <VoiceProvider>
      <Main />
    </VoiceProvider>
  );
}
