export function StarField({ n = 60 }: { n?: number }) {
  const stars = Array.from({ length: n }, (_, i) => ({ x: (i * 53) % 100, y: (i * 37) % 100, s: 0.5 + ((i * 17) % 10) / 10 }));
  return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    {stars.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.s * 0.35} fill="#e8e6e1" opacity={0.25 + (st.s % 1) * 0.4} />)}
  </svg>;
}
