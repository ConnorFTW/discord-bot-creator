type BotIconProps = {
  url: string;
};

export default function BotIcon({ url }: BotIconProps) {
  return (
    <img
      src={url}
      alt="bot"
      className="bot-icon"
      style={{ borderRadius: '0.75rem', width: '10rem' }}
    />
  );
}
