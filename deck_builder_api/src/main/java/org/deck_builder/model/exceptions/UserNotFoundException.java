package org.deck_builder.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "User Email Not Found.")
public class UserNotFoundException extends RuntimeException {

}
