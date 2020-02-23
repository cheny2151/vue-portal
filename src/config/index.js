import * as devConfig from './dev.config'
import * as prodConfig from './prod.config'

let config

switch (process.env.CODE_ENV) {
  case 'production':
    config = prodConfig 
    break;
  default:
    config = devConfig
}

export default Object.assign({}, config)
