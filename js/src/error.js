"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongValidation = exports.CouldNotFindNftOwner = exports.RecordMalformed = exports.DomainDoesNotExist = exports.PdaOwnerNotAllowed = exports.NftRecordNotFoundError = exports.InvalidParrentError = exports.InvalidPdaError = exports.InvalidRoAError = exports.PythFeedNotFoundError = exports.MissingVerifierError = exports.InvalidSolRecordV2Error = exports.UnsupportedSignatureTypeError = exports.RecordIsNotSignedError = exports.RecordDoestNotSupportGuardianSigError = exports.UnsupportedSignatureError = exports.InvalidCustomBgError = exports.InvalidDomainError = exports.InvalidInputError = exports.NoAccountDataError = exports.InvalidReverseTwitterError = exports.MultipleRegistriesError = exports.AccountDoesNotExistError = exports.InvalidSignatureError = exports.InvalidRecordInputError = exports.InvalidAAAARecordError = exports.InvalidARecordError = exports.InvalidInjectiveAddressError = exports.InvalidEvmAddressError = exports.UnsupportedRecordError = exports.InvalidRecordDataError = exports.NoRecordDataError = exports.U64OverflowError = exports.InvalidBufferLengthError = exports.U32OverflowError = exports.MissingParentOwnerError = exports.FavouriteDomainNotFoundError = exports.InvalidSubdomainError = exports.SymbolNotFoundError = exports.SNSError = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["SymbolNotFound"] = "SymbolNotFound";
    ErrorType["InvalidSubdomain"] = "InvalidSubdomain";
    ErrorType["FavouriteDomainNotFound"] = "FavouriteDomainNotFound";
    ErrorType["MissingParentOwner"] = "MissingParentOwner";
    ErrorType["U32Overflow"] = "U32Overflow";
    ErrorType["InvalidBufferLength"] = "InvalidBufferLength";
    ErrorType["U64Overflow"] = "U64Overflow";
    ErrorType["NoRecordData"] = "NoRecordData";
    ErrorType["InvalidRecordData"] = "InvalidRecordData";
    ErrorType["UnsupportedRecord"] = "UnsupportedRecord";
    ErrorType["InvalidEvmAddress"] = "InvalidEvmAddress";
    ErrorType["InvalidInjectiveAddress"] = "InvalidInjectiveAddress";
    ErrorType["InvalidARecord"] = "InvalidARecord";
    ErrorType["InvalidAAAARecord"] = "InvalidAAAARecord";
    ErrorType["InvalidRecordInput"] = "InvalidRecordInput";
    ErrorType["InvalidSignature"] = "InvalidSignature";
    ErrorType["AccountDoesNotExist"] = "AccountDoesNotExist";
    ErrorType["MultipleRegistries"] = "MultipleRegistries";
    ErrorType["InvalidReverseTwitter"] = "InvalidReverseTwitter";
    ErrorType["NoAccountData"] = "NoAccountData";
    ErrorType["InvalidInput"] = "InvalidInput";
    ErrorType["InvalidDomain"] = "InvalidDomain";
    ErrorType["InvalidCustomBg"] = "InvalidCustomBackground";
    ErrorType["UnsupportedSignature"] = "UnsupportedSignature";
    ErrorType["RecordDoestNotSupportGuardianSig"] = "RecordDoestNotSupportGuardianSig";
    ErrorType["RecordIsNotSigned"] = "RecordIsNotSigned";
    ErrorType["UnsupportedSignatureType"] = "UnsupportedSignatureType";
    ErrorType["InvalidSolRecordV2"] = "InvalidSolRecordV2";
    ErrorType["MissingVerifier"] = "MissingVerifier";
    ErrorType["PythFeedNotFound"] = "PythFeedNotFound";
    ErrorType["InvalidRoA"] = "InvalidRoA";
    ErrorType["InvalidPda"] = "InvalidPda";
    ErrorType["InvalidParrent"] = "InvalidParrent";
    ErrorType["NftRecordNotFound"] = "NftRecordNotFound";
    ErrorType["PdaOwnerNotAllowed"] = "PdaOwnerNotAllowed";
    ErrorType["DomainDoesNotExist"] = "DomainDoesNotExist";
    ErrorType["RecordMalformed"] = "RecordMalformed";
    ErrorType["CouldNotFindNftOwner"] = "CouldNotFindNftOwner";
    ErrorType["WrongValidation"] = "WrongValidation";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class SNSError extends Error {
    constructor(type, message) {
        super(message);
        this.name = "SNSError";
        this.type = type;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SNSError);
        }
    }
}
exports.SNSError = SNSError;
class SymbolNotFoundError extends SNSError {
    constructor(message) {
        super(ErrorType.SymbolNotFound, message);
    }
}
exports.SymbolNotFoundError = SymbolNotFoundError;
class InvalidSubdomainError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidSubdomain, message);
    }
}
exports.InvalidSubdomainError = InvalidSubdomainError;
class FavouriteDomainNotFoundError extends SNSError {
    constructor(message) {
        super(ErrorType.FavouriteDomainNotFound, message);
    }
}
exports.FavouriteDomainNotFoundError = FavouriteDomainNotFoundError;
class MissingParentOwnerError extends SNSError {
    constructor(message) {
        super(ErrorType.MissingParentOwner, message);
    }
}
exports.MissingParentOwnerError = MissingParentOwnerError;
class U32OverflowError extends SNSError {
    constructor(message) {
        super(ErrorType.U32Overflow, message);
    }
}
exports.U32OverflowError = U32OverflowError;
class InvalidBufferLengthError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidBufferLength, message);
    }
}
exports.InvalidBufferLengthError = InvalidBufferLengthError;
class U64OverflowError extends SNSError {
    constructor(message) {
        super(ErrorType.U64Overflow, message);
    }
}
exports.U64OverflowError = U64OverflowError;
class NoRecordDataError extends SNSError {
    constructor(message) {
        super(ErrorType.NoRecordData, message);
    }
}
exports.NoRecordDataError = NoRecordDataError;
class InvalidRecordDataError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidRecordData, message);
    }
}
exports.InvalidRecordDataError = InvalidRecordDataError;
class UnsupportedRecordError extends SNSError {
    constructor(message) {
        super(ErrorType.UnsupportedRecord, message);
    }
}
exports.UnsupportedRecordError = UnsupportedRecordError;
class InvalidEvmAddressError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidEvmAddress, message);
    }
}
exports.InvalidEvmAddressError = InvalidEvmAddressError;
class InvalidInjectiveAddressError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidInjectiveAddress, message);
    }
}
exports.InvalidInjectiveAddressError = InvalidInjectiveAddressError;
class InvalidARecordError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidARecord, message);
    }
}
exports.InvalidARecordError = InvalidARecordError;
class InvalidAAAARecordError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidAAAARecord, message);
    }
}
exports.InvalidAAAARecordError = InvalidAAAARecordError;
class InvalidRecordInputError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidRecordInput, message);
    }
}
exports.InvalidRecordInputError = InvalidRecordInputError;
class InvalidSignatureError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidSignature, message);
    }
}
exports.InvalidSignatureError = InvalidSignatureError;
class AccountDoesNotExistError extends SNSError {
    constructor(message) {
        super(ErrorType.AccountDoesNotExist, message);
    }
}
exports.AccountDoesNotExistError = AccountDoesNotExistError;
class MultipleRegistriesError extends SNSError {
    constructor(message) {
        super(ErrorType.MultipleRegistries, message);
    }
}
exports.MultipleRegistriesError = MultipleRegistriesError;
class InvalidReverseTwitterError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidReverseTwitter, message);
    }
}
exports.InvalidReverseTwitterError = InvalidReverseTwitterError;
class NoAccountDataError extends SNSError {
    constructor(message) {
        super(ErrorType.NoAccountData, message);
    }
}
exports.NoAccountDataError = NoAccountDataError;
class InvalidInputError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidInput, message);
    }
}
exports.InvalidInputError = InvalidInputError;
class InvalidDomainError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidDomain, message);
    }
}
exports.InvalidDomainError = InvalidDomainError;
class InvalidCustomBgError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidCustomBg, message);
    }
}
exports.InvalidCustomBgError = InvalidCustomBgError;
class UnsupportedSignatureError extends SNSError {
    constructor(message) {
        super(ErrorType.UnsupportedSignature, message);
    }
}
exports.UnsupportedSignatureError = UnsupportedSignatureError;
class RecordDoestNotSupportGuardianSigError extends SNSError {
    constructor(message) {
        super(ErrorType.RecordDoestNotSupportGuardianSig, message);
    }
}
exports.RecordDoestNotSupportGuardianSigError = RecordDoestNotSupportGuardianSigError;
class RecordIsNotSignedError extends SNSError {
    constructor(message) {
        super(ErrorType.RecordIsNotSigned, message);
    }
}
exports.RecordIsNotSignedError = RecordIsNotSignedError;
class UnsupportedSignatureTypeError extends SNSError {
    constructor(message) {
        super(ErrorType.UnsupportedSignatureType, message);
    }
}
exports.UnsupportedSignatureTypeError = UnsupportedSignatureTypeError;
class InvalidSolRecordV2Error extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidSolRecordV2, message);
    }
}
exports.InvalidSolRecordV2Error = InvalidSolRecordV2Error;
class MissingVerifierError extends SNSError {
    constructor(message) {
        super(ErrorType.MissingVerifier, message);
    }
}
exports.MissingVerifierError = MissingVerifierError;
class PythFeedNotFoundError extends SNSError {
    constructor(message) {
        super(ErrorType.PythFeedNotFound, message);
    }
}
exports.PythFeedNotFoundError = PythFeedNotFoundError;
class InvalidRoAError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidRoA, message);
    }
}
exports.InvalidRoAError = InvalidRoAError;
class InvalidPdaError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidPda, message);
    }
}
exports.InvalidPdaError = InvalidPdaError;
class InvalidParrentError extends SNSError {
    constructor(message) {
        super(ErrorType.InvalidParrent, message);
    }
}
exports.InvalidParrentError = InvalidParrentError;
class NftRecordNotFoundError extends SNSError {
    constructor(message) {
        super(ErrorType.NftRecordNotFound, message);
    }
}
exports.NftRecordNotFoundError = NftRecordNotFoundError;
class PdaOwnerNotAllowed extends SNSError {
    constructor(message) {
        super(ErrorType.PdaOwnerNotAllowed, message);
    }
}
exports.PdaOwnerNotAllowed = PdaOwnerNotAllowed;
class DomainDoesNotExist extends SNSError {
    constructor(message) {
        super(ErrorType.DomainDoesNotExist, message);
    }
}
exports.DomainDoesNotExist = DomainDoesNotExist;
class RecordMalformed extends SNSError {
    constructor(message) {
        super(ErrorType.RecordMalformed, message);
    }
}
exports.RecordMalformed = RecordMalformed;
class CouldNotFindNftOwner extends SNSError {
    constructor(message) {
        super(ErrorType.CouldNotFindNftOwner, message);
    }
}
exports.CouldNotFindNftOwner = CouldNotFindNftOwner;
class WrongValidation extends SNSError {
    constructor(message) {
        super(ErrorType.WrongValidation, message);
    }
}
exports.WrongValidation = WrongValidation;
