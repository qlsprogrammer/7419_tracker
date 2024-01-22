
export default function Index() {

}

export const getServerSideProps = async () => {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  };