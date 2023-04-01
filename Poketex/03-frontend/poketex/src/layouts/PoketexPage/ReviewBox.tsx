import { Link } from "react-router-dom";
import PoketexModel from "../../models/PoketexModel";

export const ReviewBox: React.FC<{ poketex: PoketexModel | undefined, mobile: boolean }> = (props) => {
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card d-flex mt-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>0/5</b>
                        pokemon checked out
                    </p>
                    <hr />
                    {props.poketex && props.poketex.baseEggSteps > 0 ?
                        <h4 className='text-success'>
                            Avaliable
                        </h4>
                        :
                        <h4 className='text-danger'>
                            Not Avaliable
                        </h4>
                    }
                    <div className='row'>
                        <p className='col-6 lead'>
                            <b>{props.poketex?.baseEggSteps}</b>
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.poketex?.baseTotal}</b>
                        </p>
                    </div>
                </div>
                <Link to='/#' className='btn btn-success btn-lg'>Sign In</Link>
                <hr />
                <p className='mt-3'>
                    This number can change until placing orden has been complete.
                </p>
                <p>
                    Sign in to be able to leave a review
                </p>
            </div>
        </div>
    );
}