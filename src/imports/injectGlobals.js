import { injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';

injectGlobal`
  ${styledNormalize}
   
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;
