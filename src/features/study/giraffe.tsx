import type { Pose } from '@/types/domain';

/*
 * Zola the giraffe — a cute, animatable SVG with three poses: idle (waves),
 * study (head down at the desk, writing), cheer (arms up, sparkles). All the
 * motion lives in CSS (theme.css), keyed off the data-pose attribute.
 */
export function Giraffe({ pose = 'idle', size = 240 }: { pose?: Pose; size?: number }) {
  return (
    <div className="tw-giraffe" data-pose={pose} style={{ width: size, height: size * 1.15 }}>
      <svg viewBox="0 0 260 300" width="100%" height="100%" aria-hidden="true">
        <defs>
          <clipPath id="tw-deskClip">
            <rect x="0" y="232" width="260" height="68" />
          </clipPath>
        </defs>

        <ellipse
          className="tw-shadow"
          cx="130"
          cy="280"
          rx="86"
          ry="13"
          fill="rgba(120,80,30,0.13)"
        />

        <g className="tw-body-bob">
          <path d="M78 250 C72 196 86 168 130 168 C174 168 188 196 182 250 Z" fill="var(--gir)" />
          <path
            d="M104 250 C100 210 110 192 130 192 C150 192 160 210 156 250 Z"
            fill="var(--gir-belly)"
          />
          <ellipse cx="96" cy="210" rx="9" ry="11" fill="var(--gir-spot)" opacity="0.9" />
          <ellipse cx="166" cy="212" rx="8" ry="10" fill="var(--gir-spot)" opacity="0.9" />
          <ellipse cx="120" cy="178" rx="6" ry="7" fill="var(--gir-spot)" opacity="0.75" />

          <rect
            className="tw-neck"
            x="113"
            y="92"
            width="34"
            height="92"
            rx="17"
            fill="var(--gir)"
          />
          <ellipse cx="130" cy="120" rx="7" ry="9" fill="var(--gir-spot)" opacity="0.85" />
          <ellipse cx="130" cy="150" rx="7" ry="9" fill="var(--gir-spot)" opacity="0.85" />
          <path
            d="M130 96 C123 110 123 150 127 182"
            fill="none"
            stroke="var(--gir-spot)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.55"
          />

          <g className="tw-head">
            <g className="tw-ear-l">
              <path d="M104 70 C90 62 84 66 88 78 C92 86 102 84 108 78 Z" fill="var(--gir)" />
            </g>
            <g className="tw-ear-r">
              <path d="M156 70 C170 62 176 66 172 78 C168 86 158 84 152 78 Z" fill="var(--gir)" />
            </g>
            <g className="tw-horn-l">
              <rect x="112" y="40" width="6" height="18" rx="3" fill="var(--gir)" />
              <circle cx="115" cy="39" r="6" fill="var(--gir-spot)" />
            </g>
            <g className="tw-horn-r">
              <rect x="142" y="40" width="6" height="18" rx="3" fill="var(--gir)" />
              <circle cx="145" cy="39" r="6" fill="var(--gir-spot)" />
            </g>
            <path
              d="M104 74 C104 58 118 50 130 50 C142 50 156 58 156 74 C156 86 150 96 142 102 L118 102 C110 96 104 86 104 74 Z"
              fill="var(--gir)"
            />
            <path
              d="M116 96 C116 108 124 114 130 114 C136 114 144 108 144 96 C144 90 138 88 130 88 C122 88 116 90 116 96 Z"
              fill="var(--gir-belly)"
            />
            <ellipse cx="123" cy="100" rx="2.4" ry="3" fill="var(--gir-spot)" opacity="0.6" />
            <ellipse cx="137" cy="100" rx="2.4" ry="3" fill="var(--gir-spot)" opacity="0.6" />
            <g className="tw-eye tw-eye-l">
              <ellipse cx="119" cy="76" rx="7.5" ry="8.5" fill="#fff" />
              <circle className="tw-pupil" cx="120" cy="77" r="4" fill="#3a2a1c" />
              <circle cx="118.5" cy="75" r="1.4" fill="#fff" />
            </g>
            <g className="tw-eye tw-eye-r">
              <ellipse cx="141" cy="76" rx="7.5" ry="8.5" fill="#fff" />
              <circle className="tw-pupil" cx="140" cy="77" r="4" fill="#3a2a1c" />
              <circle cx="138.5" cy="75" r="1.4" fill="#fff" />
            </g>
            <g className="tw-lid">
              <path
                d="M111 76 q8 -7 16 0"
                fill="none"
                stroke="var(--gir-spot)"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="tw-lid-l"
              />
              <path
                d="M133 76 q8 -7 16 0"
                fill="none"
                stroke="var(--gir-spot)"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="tw-lid-r"
              />
            </g>
            <ellipse cx="112" cy="90" rx="5" ry="3.5" fill="#e88c6a" opacity="0.4" />
            <ellipse cx="148" cy="90" rx="5" ry="3.5" fill="#e88c6a" opacity="0.4" />
          </g>

          <g className="tw-arm tw-arm-l">
            <path
              d="M92 206 C78 214 72 226 76 238"
              fill="none"
              stroke="var(--gir)"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <circle cx="76" cy="240" r="8" fill="var(--gir-spot)" />
          </g>
          <g className="tw-arm tw-arm-r">
            <path
              d="M168 206 C182 214 188 226 184 238"
              fill="none"
              stroke="var(--gir)"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <circle cx="184" cy="240" r="8" fill="var(--gir-spot)" />
          </g>

          <g className="tw-pencil">
            <rect
              x="78"
              y="226"
              width="4"
              height="22"
              rx="2"
              fill="#d98a3a"
              transform="rotate(32 80 237)"
            />
            <path d="M88 250 l4 -3 1 4 z" fill="#5a3a1c" />
          </g>

          <g className="tw-spark">
            <path
              className="tw-spark-1"
              d="M64 120 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"
              fill="var(--accent)"
            />
            <path
              className="tw-spark-2"
              d="M196 110 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z"
              fill="var(--gir)"
            />
            <path
              className="tw-spark-3"
              d="M188 160 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"
              fill="var(--accent)"
            />
          </g>
        </g>

        <g className="tw-desk">
          <rect x="44" y="236" width="172" height="14" rx="5" fill="var(--desk)" />
          <rect x="44" y="236" width="172" height="5" rx="2.5" fill="var(--desk-top)" />
          <g className="tw-book">
            <path
              d="M112 236 C120 231 130 231 130 234 C130 231 140 231 148 236 Z"
              fill="#fff"
              stroke="var(--line-ink)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M130 234 v2" stroke="var(--line-ink)" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
