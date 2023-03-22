import HomeIcon from '@mui/icons-material/Home';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/header.module.scss';
import AvailableChains from './AvailableChains';

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href={'/'}>
        <HomeIcon
          sx={{ width: '220px', fontSize: '40px', color: 'primary.main' }}
        />
      </Link>
      <Link href={'/'}>
        <Image src="/logo_big.png" alt="logo" width={300} height={100} />
      </Link>
      <AvailableChains />
    </div>
  );
}
