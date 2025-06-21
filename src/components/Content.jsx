const Content = ({children}) => {
  return (
    <div className="min-h-screen min-w-screen bg-[url(./assets/unalmed_bg.jpg)] bg-cover bg-center flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default Content;