type Props = {
  width: string;
  height: string;
};

export default function EditIcon({ width, height }: Props) {
  return (
    <svg
      className="inline-block"
      fill="#000000"
      width={width + "px"}
      height={height + "px"}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>수정</title>

      <g data-name="01" id="_01">
        <path d="M22.43,5.32a1,1,0,0,0-1.41,0L6.29,20.05a1,1,0,0,0-.29.71V25a1,1,0,0,0,1,1h4.24a1,1,0,0,0,.71-.29L26.68,11a1,1,0,0,0,0-1.41ZM10.83,24H8V21.17L18.88,10.29l2.83,2.83ZM23.12,11.71,20.29,8.88l1.43-1.44,2.83,2.83Z" />
      </g>
    </svg>
  );
}
