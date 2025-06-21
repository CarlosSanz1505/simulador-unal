const Container = ({ children, ...props }) => {
  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-8 bg-zinc-50 shadow-md rounded-lg`}
      {...props}
    >
      {children}
    </div>
  );
}
export default Container;