package com.pushcode.backend.dto;

import com.pushcode.backend.enums.Language;
import lombok.Data;

@Data
public class ExecutionRequest {

    private Language language;

    private String code;

}
