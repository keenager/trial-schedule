type Props = {
  width: string;
  height: string;
};

export default function DeleteIcon({ width, height }: Props) {
  return (
    <svg
      className="inline-block"
      fill="#000000"
      width={width + "px"}
      height={height + "px"}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>삭제</title>

      <g data-name="01" id="_01">
        <path d="M13,20V14a1,1,0,0,1,2,0v6a1,1,0,0,1-2,0Zm5,1a1,1,0,0,0,1-1V14a1,1,0,0,0-2,0v6A1,1,0,0,0,18,21ZM7,10A1,1,0,0,1,8,9h4V7a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1V9h4a1,1,0,0,1,0,2H23V22a4,4,0,0,1-4,4H13a4,4,0,0,1-4-4V11H8A1,1,0,0,1,7,10Zm7-1h4V8H14ZM11,22a2,2,0,0,0,2,2h6a2,2,0,0,0,2-2V11H11Z" />
      </g>
    </svg>
  );
}
