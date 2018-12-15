/**---------------------------------------------------------------------------
 * > Super class of custom errnos
 *
 * @class Errno
 * @constructor
 * @extends Error
 */
class Errno extends Error{
  constructor(message){
    super(message);
    this.name = getClassName(this);
  }
}
/**---------------------------------------------------------------------------
 * > Argument Error
 *
 * @class ArgumentError
 * @constructor
 * @extends Errno
 */
class ArgumentError extends Errno{
  /**---------------------------------------------------------------------------
   * @constructor
   * @param {String} [message] - (Optional) Prefix message
   * @param {Number} expected - number of expected params
   * @param {Number} received - number of received params
   */
  constructor(...args){
    let expected = 0, received = 0, message = '';
    if(getClassName(args[0]).toLowerCase == "string"){      
      message = args[0];
      expected = args[1]; received = args[2];
    }
    else{
      expected = args[0]; received = args[1];
    }
    message = message + "Expected " + expected + ", received " + received;
    super(message);
  }
}
/**---------------------------------------------------------------------------
 * > Http Error
 *
 * @class HttpError
 * @constructor
 * @extends Errno
 */
class HttpError extends Errno{
  constructor(...args){
    let message = ''
    switch(parseInt(args[0])){
      case 404:
        message = "Not found"
    }
    super("HttpRequestError: " + message);
  }
}
/**---------------------------------------------------------------------------
 * > Resource Error
 * @class ResourceError
 * @constructor
 * @extends Errno
 */
class ResourceError extends Errno{
  constructor(...args){
    let message = args[0] || ''
    super("Resources Error: " + message);
  }
}
/**---------------------------------------------------------------------------
 * > Type Error
 * @class TypeError
 * @constructor
 * @extends Errno
 */
class TypeError extends Errno{
  /**
   * @constructor
   * @param {Object} re - the object received
   * @param {Object} ex - expected class
   */
  constructor(re, ex){
    if(re){re = getClassName(re);}
    super("Type Error:\n" + "Expected " + ex.name + ", got " + re);
  }
}